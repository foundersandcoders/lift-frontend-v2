import express, { Request, Response } from "express";
import { Resend } from "resend";

export async function x () {}

/*
app.get("/", async (req: Request, res: Response) => {
  const { data, error } = await resend.emails.send({
    from: "Employee Journal <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "hello world",
    html: "<strong>it works!</strong>",
  });

  if (error) {
    return res.status(400).json({ error });
  }

  res.status(200).json({ data });
});

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
*/