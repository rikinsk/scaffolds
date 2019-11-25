function template (
  actionName,
  arguments,
  outputType,
  typesAst
) {
  return`
const handler = (requestBody) => {
  const {
    input,
  } = requestBody

  // custom logig

  return {
    data: {
      // spread the fields of the output type here
    }
  }
}
`;
};