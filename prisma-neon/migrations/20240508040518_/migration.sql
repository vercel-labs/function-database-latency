-- CreateTable
CREATE TABLE "employees" (
    "emp_no" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("emp_no")
);
