import { createClient } from "@/lib/supabase/server";

export type AdminSession = {
  userId: string;
  email: string;
  role: string;
  roleName: string;
  permissions: string[];
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError?.name === "AuthSessionMissingError") return null;
  if (userError) throw userError;
  if (!user) return null;

  const { data: assignments, error: assignmentsError } = await supabase
    .from("admin_user_roles")
    .select("role_code")
    .eq("user_id", user.id);
  if (assignmentsError) throw assignmentsError;

  const roleCodes = assignments.map(({ role_code }) => role_code);
  if (!roleCodes.length) return null;

  const { data: roles, error: rolesError } = await supabase
    .from("admin_roles")
    .select("code, name")
    .in("code", roleCodes);
  if (rolesError) throw rolesError;

  const role = roles[0];
  if (!role) return null;

  const { data: rolePermissions, error: permissionsError } = await supabase
    .from("admin_role_permissions")
    .select("permission_code")
    .in("role_code", roleCodes);
  if (permissionsError) throw permissionsError;

  return {
    userId: user.id,
    email: user.email ?? "",
    role: role.code,
    roleName: role.name,
    permissions: [
      ...new Set(rolePermissions.map(({ permission_code }) => permission_code)),
    ],
  };
}

export async function hasAdminPermission(
  permission: string,
): Promise<AdminSession | null> {
  const session = await getAdminSession();
  return session?.permissions.includes(permission) ? session : null;
}
