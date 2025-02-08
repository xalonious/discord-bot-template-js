module.exports = (existingCommand, localCommand) => {
    const areChoicesDifferent = (existingChoices, localChoices) => {
      return localChoices.some(localChoice => {
        const existingChoice = existingChoices?.find(choice => choice.name === localChoice.name);
        return !existingChoice || localChoice.value !== existingChoice.value;
      });
    };
  
    const areOptionsDifferent = (existingOptions, localOptions) => {
      return localOptions.some(localOption => {
        const existingOption = existingOptions?.find(option => option.name === localOption.name);
        return !existingOption ||
          localOption.description !== existingOption.description ||
          localOption.type !== existingOption.type ||
          (localOption.required || false) !== existingOption.required ||
          (localOption.choices?.length || 0) !== (existingOption.choices?.length || 0) ||
          areChoicesDifferent(localOption.choices || [], existingOption.choices || []);
      });
    };
  
    return existingCommand.description !== localCommand.description ||
      existingCommand.options?.length !== (localCommand.options?.length || 0) ||
      areOptionsDifferent(existingCommand.options, localCommand.options || []);
  };