import { prisma } from "./prisma";

export async function getPlatformSettings() {
  try {
    const settings = await prisma.platformSettings.findUnique({
      where: { id: 1 },
    });

    if (!settings) {
      // Create default settings if none exist
      return prisma.platformSettings.create({
        data: {
          id: 1,
          siteName: "AGRINOVA",
          allowRegistrations: true,
          requireVerification: true,
          maintenanceMode: false,
        },
      });
    }

    return settings;
  } catch (error) {
    // Fallback if table doesn't exist yet
    console.warn("Platform settings not found, using defaults");
    return {
      id: 1,
      siteName: "AGRINOVA",
      supportEmail: null,
      supportPhone: null,
      allowRegistrations: true,
      requireVerification: true,
      maintenanceMode: false,
      announcement: null,
      updatedAt: new Date(),
    };
  }
}