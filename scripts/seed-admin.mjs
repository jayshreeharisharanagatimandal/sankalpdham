import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const fullName = process.env.ADMIN_NAME?.trim() || "Super Admin";

if (!supabaseUrl || !serviceRoleKey || !email) {
  throw new Error(
    "Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and ADMIN_EMAIL before seeding.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let page = 1;
let adminUser = null;
const perPage = 1000;

while (!adminUser) {
  const { data, error } = await supabase.auth.admin.listUsers({
    page,
    perPage,
  });
  if (error) throw error;

  adminUser = data.users.find((user) => user.email?.toLowerCase() === email);
  if (adminUser || data.users.length < perPage) break;
  page += 1;
}

if (!adminUser) {
  if (!password || password.length < 12) {
    throw new Error(
      "ADMIN_PASSWORD must be at least 12 characters when creating the initial admin account.",
    );
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (error) throw error;
  adminUser = data.user;
}

const { error } = await supabase
  .from("admin_user_roles")
  .upsert(
    { user_id: adminUser.id, role_code: "super_admin" },
    { onConflict: "user_id,role_code" },
  );

if (error) throw error;

console.log(`Super admin role assigned to ${email}.`);
