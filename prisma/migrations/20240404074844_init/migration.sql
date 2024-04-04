-- CreateTable
CREATE TABLE "employee" (
    "emp_no" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("emp_no")
);
