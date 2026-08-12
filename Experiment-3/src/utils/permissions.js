const rolePermissions = {
  ADMIN: ['VIEW_POSTS', 'CREATE_POSTS', 'EDIT_POSTS', 'DELETE_POSTS'],
  EDITOR: ['VIEW_POSTS', 'CREATE_POSTS', 'EDIT_POSTS'],
  VIEWER: ['VIEW_POSTS'],
};

export function hasPermission(user, permission) {
  if (!user || !user.role) {
    return false;
  }
  return rolePermissions[user.role]?.includes(permission);
}

export function hasRole(user, allowedRoles = []) {
  if (!user || !user.role) {
    return false;
  }

  return allowedRoles.includes(user.role);
}

export function getPermissionsSummary(role) {
  const all = ['CREATE_POSTS', 'EDIT_POSTS', 'DELETE_POSTS', 'VIEW_POSTS'];
  return all.map(permission => ({
    permission,
    allowed: rolePermissions[role]?.includes(permission) || false,
  }));
}

export function permissionLabel(permission) {
  switch (permission) {
    case 'CREATE_POSTS':
      return 'Create';
    case 'EDIT_POSTS':
      return 'Edit';
    case 'DELETE_POSTS':
      return 'Delete';
    case 'VIEW_POSTS':
      return 'View';
    default:
      return permission;
  }
}
