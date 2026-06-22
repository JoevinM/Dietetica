import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../PrismaClient.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

async function login(email, password) {
  let account = await prisma.user.findUnique({ where: { email } });
  let role;

  if (account) {
    role = "user"; // User normal, jamais admin
  } else {
    account = await prisma.dietician.findUnique({ where: { email } });
    if (!account) throw new Error("Wrong Credential");

    // Dietician peut être admin ou non
    role = account.admin ? "admin" : "dietician";
  }

  const ok = await bcrypt.compare(password, account.password);
  if (!ok) throw new Error("Wrong Credential");

  // Crée le token
  const token = jwt.sign(
    { id: account.id, role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  const user =
    {
      id: account.id,
      email: account.email,
      name: `${account.first_name} ${account.last_name}`,
      role, // "user" | "dietician" | "admin"
    };
    return { user, token };
}

async function me(token) {
  const decoded = jwt.verify(token, JWT_SECRET);
  let account = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!account) account = await prisma.dietician.findUnique({ where: { id: decoded.id } });
  if (!account) throw new Error("User not found");

  const role = account.admin ? "admin" : account.role || "user";
  return { id: account.id, email: account.email, name: `${account.first_name} ${account.last_name}`, role };
}

export default { login, me };
