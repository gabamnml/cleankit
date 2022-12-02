let choices = ['YES','NO'];
export const prompts = [
    {
      type: 'list',
      name: 'packages',
      message: "Clean JS packages",
      choices: choices
    },
    {
      type: 'list',
      name: 'osFiles',
      message: "Clean OS files",
      choices: choices
    },
    {
        type: 'list',
        name: 'gitFiles',
        message: "Clean GIT files",
        choices: choices
      },        
  ]