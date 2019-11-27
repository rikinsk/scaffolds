function handlerTemplate (mutationAst, typesAst) {
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

export default handler;
`;
};

function routeTemplate (mutationAst, typesAst) {
  const mutationDef = mutationAst.definitions[0].fields[0];
  const actionName = mutationDef.name.value;

  return `
router.get('/${actionName.toLowerCase()}', (req, res) => {
  const response = require('./${actionName}')(req.body);
  return res.json(response);
})
`

}
