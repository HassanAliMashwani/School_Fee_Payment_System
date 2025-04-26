import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaChild } from "react-icons/fa";
import { reset } from "../features/auth/authSlice";
import Spinner from "../components/Utilities/Progress/Spinner";
import { getStudents, createStudent } from "../features/students/studentSlice";
import { getSchools } from "../features/schools/schoolSlice";

function RegisterStudent() {
  // ✅ S - Single Responsibility: State management
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    grade: "",
    section: "",
  });
  const [school, setSchool] = useState("");

  const { fname, lname, grade, section } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { students, isLoading, isError, message } = useSelector((state) => state.students);
  const { schools } = useSelector((state) => state.schools);

  // ✅ S - Single Responsibility: Effect to handle auth and data loading
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    if (isError) {
      console.error("Error fetching data:", message);
    }

    dispatch(getStudents());
    dispatch(getSchools());

    return () => {
      dispatch(reset()); // Resets auth state on unmount
    };
  }, [user, navigate, isError, message, dispatch]);

  // ✅ O - Open/Closed: Automatically sets a default school if none selected
  useEffect(() => {
    if (schools.length > 0 && !school) {
      setSchool(schools[0]._id);
    }
  }, [schools, school]);

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSchoolSelection = (e) => {
    setSchool(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const studentData = {
      Id: school,
      fname,
      lname,
      grade,
      section,
    };

    dispatch(createStudent(studentData));

    // ✅ S - Single Responsibility: Clear form after submission
    setFormData({
      fname: "",
      lname: "",
      grade: "",
      section: "",
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  // ✅ S - Single Responsibility: UI rendering handled separately
  return (
    <>
      <Header />
      <StudentForm
        formData={formData}
        school={school}
        schools={schools}
        onChange={onChange}
        onSubmit={onSubmit}
        handleSchoolSelection={handleSchoolSelection}
      />
    </>
  );
}

export default RegisterStudent;

// ✅ S - Separated into its own component (Single Responsibility)
function Header() {
  return (
    <section className="heading">
      <h1>
        <FaChild /> Register Student
      </h1>
    </section>
  );
}

// ✅ S - Separated form logic and view for clarity and reusability
function StudentForm({
  formData,
  school,
  schools,
  onChange,
  onSubmit,
  handleSchoolSelection,
}) {
  return (
    <section className="form">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <select onChange={handleSchoolSelection} value={school}>
            {schools.map((school) => (
              <option key={school._id} value={school._id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        <InputField
          id="fname"
          name="fname"
          type="text"
          value={formData.fname}
          placeholder="Student first name"
          onChange={onChange}
        />

        <InputField
          id="lname"
          name="lname"
          type="text"
          value={formData.lname}
          placeholder="Student last name"
          onChange={onChange}
        />

        <InputField
          id="grade"
          name="grade"
          type="text"
          value={formData.grade}
          placeholder="Student grade"
          onChange={onChange}
        />

        <InputField
          id="section"
          name="section"
          type="text"
          value={formData.section}
          placeholder="Enter student section"
          onChange={onChange}
        />

        <button className="btn btn-block form-group">Register Student</button>
      </form>
    </section>
  );
}

// ✅ O - Open for reuse in other forms; closed for modification in this component
function InputField({ id, name, type, value, placeholder, onChange }) {
  return (
    <div className="form-group">
      <input
        className="form-control"
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}
