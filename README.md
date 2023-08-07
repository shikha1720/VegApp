SOFTWARE REQUIREMENTS :--

1- Angular 16.0.2
2- Dotnet 6
3- Visual Studio 2022
4- VS Code
5- Microsoft SQL Server

STEPS :--

1- Open SSMS and execute the file "DB_Script_Schema_Only.sql".

2- Open GroceryApp.sln file in the visual studio 2022 and run following commands in package manager console and select Grocery.DAL in dropdown:

   => add-migration "init"
   => update-database

3- Now run these files in the given order in SSMS:

   => DB_Alter_Schema.sql
   => DataOfGroceryApp.sql

4- Now you are ready to run the project Api.

5- Open GroceryAppUI folder in VS Code.

6- Run command "ng serve --open" to launch project UI.


POINTS TO REMEBMER:--

1- Open Api first and then launch UI.
2- Follow above mentioned steps in given order.