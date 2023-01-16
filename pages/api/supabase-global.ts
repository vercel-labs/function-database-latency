import { createClient } from "@supabase/supabase-js";
import { NextRequest as Request, NextResponse as Response } from "next/server";

export const config = {
  runtime: "edge",
};

const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const start = Date.now();

export default async function api(req: Request) {
  const count = toNumber(new URL(req.url).searchParams.get("count"));
  const time = Date.now();

  let data = null;
  for (let i = 0; i < count; i++) {
    const response = await supabase
      .from("employee_table")
      .select("emp_no,first_name,last_name")
      .limit(10);
    data = response.data;
    console.log(data);
  }

  return Response.json(
    {
      data,
      queryDuration: Date.now() - time,
      invocationIsCold: start === time,
      invocationRegion:
        (req.headers.get("x-vercel-id") ?? "").split(":")[1] || null,
    },
    {
      headers: {
        "x-edge-is-cold": start === time ? "1" : "0",
      },
    }
  );
}

// convert a query parameter to a number
// also apply a min and a max
function toNumber(queryParam: string | null, min = 1, max = 5) {
  const num = Number(queryParam);
  return Number.isNaN(num) ? null : Math.min(Math.max(num, min), max);
}

// Auto generated types: https://supabase.com/docs/guides/api/generating-types
interface Database {
  public: {
    Tables: {
      employee_table: {
        Row: {
          emp_no: number;
          first_name: string | null;
          inserted_at: string;
          last_name: string | null;
          updated_at: string;
        };
        Insert: {
          emp_no?: number;
          first_name?: string | null;
          inserted_at?: string;
          last_name?: string | null;
          updated_at?: string;
        };
        Update: {
          emp_no?: number;
          first_name?: string | null;
          inserted_at?: string;
          last_name?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
