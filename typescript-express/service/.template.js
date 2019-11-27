const inbuiltTypes = {
  'Int': 'number',
  'String': 'string',
  'Float': 'number',
  'Boolean': 'boolean'
};

const isInbuilt = (typename) => !!inbuiltTypes[typename];

const getTsTypeName = (typename, allTypes) => {

  if (isInbuilt(typename)) {
    return inbuiltTypes[typename]
  };

  if (allTypes[typename] && allTypes[typename].kind === 'ScalarTypeDefinition') {
    return 'string';
  }

  return typename;
};

const handlerTemplate = (mutationAst, typesAst) => {

  const allTypes = {};
  typesAst.definitions.forEach(definition => {
    allTypes[definition.name.value] = definition
  });

  const tsClasses = {};

  const getWrappedTsType = (_wrappedType) => {
    let wrappedType = JSON.parse(JSON.stringify(_wrappedType));
    const wraps = [];
    while(true) {
      if (wrappedType.kind === 'ListType') {
        wraps.push('l');
        wrappedType= wrappedType.type;
        continue;
      }
      if (wrappedType.kind === 'NonNullType') {
        wraps.push('n');
        wrappedType= wrappedType.type;
        continue;
      }
      break;
    }
    let typename = getTsTypeName(wrappedType.name.value, allTypes);
    wraps.forEach(w => {
      if (w === 'l') {
        typename = `Array<${typename}>`
      }
    });
    // TODO array of array
    return {
      typename: wrappedType.name.value,
      tsTypename: typename,
      isArray: wraps.includes('l')
    };
  }

  const generateTypescriptEnum = (typeDef) => {
    const valueDef = typeDef.values.map(v => `  ${v.name.value} = "${v.name.value}"`);
    tsClasses[typeDef.name.value] = `
enum ${typeDef.name.value} {
${valueDef.join(',\n')}
}
`;
  };

  const generateTSClass = (typeDef) => {

    const constructorArgs = [];
    const constructorBody = [];
    const classVars = [];

    typeDef.fields.forEach(fieldDef => {
      const fieldName = fieldDef.name.value;
      const fieldTypeMetadata = getWrappedTsType(fieldDef.type);
      const fieldType = allTypes[fieldTypeMetadata.typename];
      if (fieldType && (fieldType.kind === 'InputObjectTypeDefinition' || fieldType.kind === 'ObjectTypeDefinition')) {
        if (fieldTypeMetadata.isArray) {
          constructorBody.push(`    this.${fieldName} = _input.${fieldName}.map((_i: any) => new ${fieldTypeMetadata.typename}(_i) );`);
        } else {
          constructorBody.push(`    this.${fieldName} = new ${fieldTypeMetadata.typename}(_input.${fieldName})`);
        }
      } else {
        constructorBody.push(`    this.${fieldName} = _input.${fieldName}`)
      }

      if (fieldType && fieldType.kind === 'ScalarTypeDefinition') {
        classVars.push(`  ${fieldName}: ${fieldTypeMetadata.tsTypename};`)
      } else {
        classVars.push(`  ${fieldName}: ${fieldTypeMetadata.tsTypename};`)
      }

      if (fieldType) {
        handleType(fieldType);
      }
    });

    tsClasses[typeDef.name.value] = `
class ${typeDef.name.value} {

${classVars.join('\n')}

  constructor(_input: any) {
${constructorBody.join(';\n')}
  }

}
`;

  }

  const handleType = (typeDef) => {

    if (isInbuilt(typeDef.name.value)) return;

    if (tsClasses[typeDef.name.value]) return;

    tsClasses[typeDef.name.value] = true;

    switch(typeDef.kind) {
      case 'ObjectTypeDefinition':
        generateTSClass(typeDef);
        return;
      case 'InputObjectTypeDefinition':
        generateTSClass(typeDef);
        return;
      case 'EnumTypeDefinition':
        generateTypescriptEnum(typeDef);
        return;
      default:
        return;
    }

  }

  const mutationDef = mutationAst.definitions[0].fields[0];
  const actionName = mutationDef.name.value;
  const actionPrefix = actionName[0].toUpperCase() + actionName.substring(1);

  mutationDef.arguments.forEach(argDef => {
    const argName = argDef.name.value;
    const argTypeMetadata = getWrappedTsType(argDef.type);
    if (allTypes[argTypeMetadata.typename]) {
      handleType(allTypes[argTypeMetadata.typename]);
    }
  })

  const outputType = mutationDef.type;
  const outputTypeMetadata = getWrappedTsType(outputType);

  let outputTypeConstructorBody;
  if (outputTypeMetadata.isArray) {
    outputTypeConstructorBody = `this.data = _data.map((_i: any) => new ${outputTypeMetadata.typename}(_i))`
  } else {
    outputTypeConstructorBody = `this.data = new ${outputTypeMetadata.typename}(_data)`;
  }

  if (allTypes[outputTypeMetadata.typename]) {
    handleType(allTypes[outputTypeMetadata.typename]);
  }

  const classesCodegen = Object.values(tsClasses).join('\n');

  const requestBodyVars = [];
  const requestBodyConstructorArgs = [];
  const requestBodyConstructorBody = [];

  mutationDef.arguments.forEach(argDef => {
    const argName = argDef.name.value;
    const argTypeMetadata = getWrappedTsType(argDef.type);
    const argType = allTypes[argTypeMetadata.typename];
    requestBodyVars.push(`  ${argName}: ${argTypeMetadata.tsTypename}`);
    if (argType && (argType.kind === 'InputObjectTypeDefinition' || argType.kind === 'ObjectTypeDefinition')) {
      if (argTypeMetadata.isArray) {
        requestBodyConstructorBody.push(`    this.${argName} = _input.${argName}.map((_i: any) => new ${argTypeMetadata.typename}(_i) );`);
      } else {
        requestBodyConstructorBody.push(`    this.${argName} = new ${argTypeMetadata.typename}(_input.${argName})`);
      }
    } else {
      requestBodyConstructorBody.push(`    this.${argName} = _input.${argName}`);
    }

    return ;
  })

  return `
${classesCodegen}

class ${actionPrefix}Input {

${requestBodyVars.join(';\n')}

  constructor (_input: any) {
${requestBodyConstructorBody.join(';\n')}
  }
}

class RequestBody {

  input: ${actionPrefix}Input

  constructor (_input: any) {
    this.input = new ${actionPrefix}Input(_input)
  }

}

class ResponseBody {

  data: ${outputTypeMetadata.tsTypename}

  constructor(_data: any ) {
    this.data = ${outputTypeConstructorBody}
  }

}

function requestHandler(requestBody: any) {
  const requestInput = new RequestBody(requestBody.input);

  // your logic

  const response = new ResponseBody({
    data: {

    }
  });

  return response;

};

export default requestHandler;
`

};

const routeTemplate = (mutationAst, typesAst) => {
  const actionName = mutationAst.definitions[0].fields[0].name.value;
  return `
router.post('/${actionName.toLowerCase()}', (req: Request, res: Response) => {
    const response = require('./${actionName}').default(req.body)
    return res.json(response);
});
`;
}

const FILE_EXTENSION = 'ts';


