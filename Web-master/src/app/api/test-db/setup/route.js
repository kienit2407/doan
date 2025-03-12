import { setupDatabase } from "../setup-db";

export async function GET() {
  try {
    const result = await setupDatabase();

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in setup route:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Error in setup route",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
