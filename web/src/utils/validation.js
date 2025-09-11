//checks if a username is valid according to project rules
export function isValidUsername(u) {
  //^ = start of string
  //[a-z] = any lowercase letter
  //{8} = exactly 8 characters long
  //$ = end of string
  //so: "abcdefgh" is valid, "abc12345" or "Abcdefgh" is not
  return /^[a-z]{8}$/.test(u);
  //sean's rule: usernames must be exactly 8 lowercase letters, on page 6 of the DegreeAdminOverview.pdf file
}

//checks if a password is valid according to project rules
export function isValidPassword(pw) {
  return (
    //must be a string
    typeof pw === 'string' &&
    //at least 12 characters long
    pw.length >= 12 &&
    //must contain at least 1 uppercase
    /[A-Z]/.test(pw) &&
    //must contain at least 1 lowercase
    /[a-z]/.test(pw) &&
    //must contain at least 1 int
    /\d/.test(pw) &&
    //must contain at least 1 symbol
    /[^A-Za-z0-9]/.test(pw)
  );
  //sean's rule: passwords must be >=12 chars and include: at least 1 uppercase, at least 1 lowercase, at least 1 digit, and at least 1 symbol.  also on page 6 of the pdf file.
}