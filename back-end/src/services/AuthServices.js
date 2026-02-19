import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../PrismaClient.js";

const MDP_JWT = process.env.MDP_JWT || "dev_secret";

async function login(email, password) {
  let account = await prisma.user.findUnique({ where: { email } });
  let role;

  if (account) {
    role = "user"; // User normal, jamais admin
  } else {
    account = await prisma.dietician.findUnique({ where: { email } });
    if (!account) throw new Error("Wrong Email");

    // Dietician peut être admin ou non
    role = account.admin ? "admin" : "dietician";
  }

  const ok = await bcrypt.compare(password, account.password);
  if (!ok) throw new Error("Wrong Password");

  return jwt.sign(
    {
      id: account.id,
      role, // "user" | "dietician" | "admin"
    },
    MDP_JWT,
    { expiresIn: "1h" }
  );
}

export default { login };
