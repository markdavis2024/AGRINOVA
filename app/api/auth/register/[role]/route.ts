import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/passwords";
import { saveUpload, UploadError } from "@/lib/uploads";
import type { Role } from "@prisma/client";

const ROLE_MAP: Record<string, Role> = {
  farmer: "FARMER",
  buyer: "BUYER",
  agronomist: "AGRONOMIST",
  admin: "ADMIN",
};

function str(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string") return undefined;
  return value.trim() === "" ? undefined : value;
}

function file(value: FormDataEntryValue | null): File | undefined {
  return value instanceof File && value.size > 0 ? value : undefined;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ role: string }> }
) {
  try {
    const { role: roleParam } = await params;
    const role = ROLE_MAP[roleParam.toLowerCase()];

    if (!role) {
      return NextResponse.json(
        { error: "Unknown registration type." },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const fullName = str(formData.get("fullName"));
    const email = str(formData.get("email"));
    const phone = str(formData.get("phone"));
    const password = str(formData.get("password"));
    const confirmPassword = str(formData.get("confirmPassword"));
    const terms = formData.get("terms") === "true";

    const region = str(formData.get("region"));
    const town = str(formData.get("town"));

    // Farmer
    const farmingType = str(formData.get("farmingType"));
    const farmSize = str(formData.get("farmSize"));
    const twoFactor = formData.get("twoFactor") === "true";
    const iotInterest = formData.get("iotInterest") === "true";
    const idFrontFile = file(formData.get("idFront"));
    const idBackFile = file(formData.get("idBack"));
    const farmProofFile = file(formData.get("farmProof"));

    // Buyer
    const interests = formData.getAll("interests").filter(
      (v): v is string => typeof v === "string" && v.trim() !== ""
    );

    // Agronomist
    const specialization = str(formData.get("specialization"));
    const experience = str(formData.get("experience"));
    const institution = str(formData.get("institution"));
    const certificationFile = file(formData.get("certification"));

    // Admin
    const position = str(formData.get("position"));
    const organization = str(formData.get("organization"));
    const inviteCode = str(formData.get("inviteCode"));
    const authLetterFile = file(formData.get("authLetter"));

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Please fill in all required personal information." },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Your password must be at least 8 characters." },
        { status: 400 }
      );
    }

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    if (!terms) {
      return NextResponse.json(
        { error: "Please accept the AGRINOVA terms and conditions." },
        { status: 400 }
      );
    }

    if (role === "AGRONOMIST" && (!specialization || !institution)) {
      return NextResponse.json(
        { error: "Please share your specialization and institution." },
        { status: 400 }
      );
    }

    if (role === "ADMIN" && !organization) {
      return NextResponse.json(
        { error: "Please tell us which organization you represent." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Documents are optional — upload whichever ones were provided.
    let idFrontUrl: string | undefined;
    let idBackUrl: string | undefined;
    let farmProofUrl: string | undefined;
    let certificationUrl: string | undefined;
    let authLetterUrl: string | undefined;

    try {
      if (idFrontFile) idFrontUrl = await saveUpload(idFrontFile, "farmers");
      if (idBackFile) idBackUrl = await saveUpload(idBackFile, "farmers");
      if (farmProofFile) farmProofUrl = await saveUpload(farmProofFile, "farmers");
      if (certificationFile) certificationUrl = await saveUpload(certificationFile, "agronomists");
      if (authLetterFile) authLetterUrl = await saveUpload(authLetterFile, "admins");
    } catch (uploadError) {
      if (uploadError instanceof UploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 400 });
      }
      throw uploadError;
    }

    const passwordHash = await hashPassword(password);

    // Agronomists and admins are held for manual review; farmers and
    // buyers can start using their account immediately.
    const verified = role === "AGRONOMIST" || role === "ADMIN" ? false : true;

    await prisma.user.create({
      data: {
        name: fullName,
        email,
        phone,
        password: passwordHash,
        role,
        region,
        town,
        farmingType,
        farmSize,
        twoFactor,
        iotInterest,
        idFrontUrl,
        idBackUrl,
        farmProofUrl,
        interests,
        specialization,
        experience,
        institution,
        certificationUrl,
        position,
        organization,
        inviteCode,
        authLetterUrl,
        verified,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
