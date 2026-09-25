interface DecisionEmailInput {
  applicantName: string;
  petName: string;
  shelterName: string;
}

export function applicationApprovedEmail(input: DecisionEmailInput) {
  return {
    subject: `Good news about ${input.petName}`,
    text: [
      `Hi ${input.applicantName},`,
      "",
      `Good news, your application for ${input.petName} has been approved. Our team will be in touch to confirm your meet and greet.`,
      "",
      "No payment is taken until after you meet in person, and adoption is local pickup only.",
      "",
      `${input.shelterName}`,
    ].join("\n"),
  };
}

export function applicationDeclinedEmail(input: DecisionEmailInput) {
  return {
    subject: `Update on your application for ${input.petName}`,
    text: [
      `Hi ${input.applicantName},`,
      "",
      `Thank you for applying to adopt ${input.petName}. After review, we will not be moving forward with this application.`,
      "",
      "This is not a reflection on you, sometimes a different home is a better fit for a particular pet. Please feel free to apply for another pet in the future.",
      "",
      `${input.shelterName}`,
    ].join("\n"),
  };
}

export function applicationCompletedEmail(input: DecisionEmailInput) {
  return {
    subject: `Welcome home, ${input.petName}!`,
    text: [
      `Hi ${input.applicantName},`,
      "",
      `Congratulations, the adoption of ${input.petName} is now complete. Thank you for giving them a home.`,
      "",
      "If you have any questions as you settle in, reach out any time.",
      "",
      `${input.shelterName}`,
    ].join("\n"),
  };
}
