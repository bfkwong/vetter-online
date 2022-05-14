import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import { getUserInfoRdx } from "../../redux/context/contextSelectors";

const userTypeText = {
  admin: "Admin",
  patient: "Patient",
  clinic: "Clinic"
};

const ClinicMenu = (props) => {
  const navigate = useNavigate();

  return (
    <>
      <Nav className="me-auto">
        <NavDropdown title="Visits" id="collasible-nav-dropdown">
          <NavDropdown.Item onClick={() => navigate("/clinic/visits?type=upcoming")}>Upcoming visits</NavDropdown.Item>
          <NavDropdown.Item onClick={() => navigate("/clinic/visits?type=past")}> Past visits</NavDropdown.Item>
        </NavDropdown>
        <Nav.Link onClick={() => navigate("/clinic/payments")}>Payments</Nav.Link>
      </Nav>
      <Nav>
        <NavDropdown title="Account" id="collasible-nav-dropdown">
          <NavDropdown.Item>Personal Info</NavDropdown.Item>
          <NavDropdown.Item>Payment</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item
            onClick={async () => {
              try {
                await Auth.signOut();
              } catch (error) {
                console.log("error signing out: ", error);
              }
            }}>
            Sign out
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </>
  );
};
const PatientMenu = () => {
  const navigate = useNavigate();

  return (
    <>
      <Nav className="me-auto">
        <Nav.Link onClick={() => navigate("/patient/find-doctor")}>Doctor</Nav.Link>
        <NavDropdown title="Visits" id="collasible-nav-dropdown">
          <NavDropdown.Item onClick={() => navigate("/patient/visits?type=upcoming")}>Upcoming visits</NavDropdown.Item>
          <NavDropdown.Item onClick={() => navigate("/patient/visits?type=past")}> Past visits</NavDropdown.Item>
        </NavDropdown>
        <Nav.Link onClick={() => navigate("/patient/pets")}>Pets</Nav.Link>
      </Nav>
      <Nav>
        <NavDropdown title="Account" id="collasible-nav-dropdown">
          <NavDropdown.Item>Personal Info</NavDropdown.Item>
          <NavDropdown.Item>Payment</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item
            onClick={async () => {
              try {
                await Auth.signOut();
              } catch (error) {
                console.log("error signing out: ", error);
              }
            }}>
            Sign out
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </>
  );
};

const AdminMenu = () => {
  return (
    <>
      <Nav className="me-auto">
        <Nav.Link>Visits</Nav.Link>
        <Nav.Link>Prescriptions</Nav.Link>
        <Nav.Link>Payments</Nav.Link>
      </Nav>
      <Nav>
        <Nav.Link>Sign out</Nav.Link>
      </Nav>
    </>
  );
};

export function NavbarWrapper(props) {
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfoRdx);

  return (
    <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand onClick={() => navigate(`/${userInfo?.userType}`)}>
          Vetter<span style={{ color: "rgb(155,155,155)" }}>{userTypeText[userInfo?.userType]}</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {userInfo?.userType === "admin" && <AdminMenu navigate={navigate} />}
          {userInfo?.userType === "clinic" && <ClinicMenu navigate={navigate} />}
          {userInfo?.userType === "patient" && <PatientMenu navigate={navigate} />}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
