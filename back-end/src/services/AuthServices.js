import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../PrismaClient.js";

const MDP_JWT = process.env.MDP_JWT || "dev_secret";

async function login(email, password) {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) throw new Error("Wrong Email");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Wrong Password");

  return jwt.sign(
    { id: user.id, role: "user" },
    MDP_JWT,
    { expiresIn: "1h" }
  );
}

export default { login };
