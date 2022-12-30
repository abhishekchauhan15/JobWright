import logo from "../../assets/images/logo.png";

const Logo = () => {
  return (
    <img
      src={logo}
      alt="jobwright"
      className="logo"
      style={{ width: "200px" }}
    />
  );
};

export default Logo;
