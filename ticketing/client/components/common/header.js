import Link from "next/link";

const Header = ({ currentUser }) => {
  const links = currentUser
    ? [{ label: "Sign Out", href: "/auth/signout" }]
    : [
        { label: "Sign In", href: "/auth/signin" },
        { label: "Sign Up", href: "/auth/signup" },
      ];

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>
                <a className="navbar-brand">{link.label}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
