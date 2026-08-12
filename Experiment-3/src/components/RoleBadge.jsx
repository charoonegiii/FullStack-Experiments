function RoleBadge({ role }) {
  return (
    <span className={`role-badge role-badge--${role?.toLowerCase()}`}>{role}</span>
  );
}

export default RoleBadge;
