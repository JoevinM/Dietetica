import prisma from "../PrismaClient.js";

export async function adminOnly(req, res, next) {
  try {
    // Checks if an admin already exists
    const adminExists = await prisma.dietician.findFirst({ where: { admin: true } });

    // If no admin exists yet, let it pass (first admin)
    if (!adminExists) {
      return next();
    }

    // Otherwise, verify that the user is indeed an admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    next();
  } catch (err) {
    next(err);
  }
}

export function dieticianOnly(req, res, next) {
  if (!req.user || (req.user.role !== "dietician" && req.user.role !== "admin")) {
    return res.status(403).json({ message: "Dietician only" });
  }
  next();
}


export function userOnly(req, res, next) {
  if (!req.user || (req.user.role !== "user" && req.user.role !== "admin")) {
    return res.status(403).json({ message: "User only" });
  }
  next();
}
