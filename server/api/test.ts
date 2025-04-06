// server/api/test.js
export default defineEventHandler(async (event) => {
    console.log("La route test a été appelée");
    return { message: "Test réussi" };
  });
  