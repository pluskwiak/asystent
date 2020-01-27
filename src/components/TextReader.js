import Tts from 'react-native-tts';

export default class TextReader {

    readed = []
    instructions=[]

    constructor (instructionsToRead)
    {
    
        this.instructions = instructionsToRead;
     
        for (i=0; i <this.instructions.length; i++)
        {
            this.readed.push (false);
        }
    }


    
    readInstruction (NR)
    {
            //console.log(NR);
            if (!this.readed[NR])
            {
                //console.log(this.instructions);
                //console.log(NR);
                instruction = this.instructions[NR];
                //console.log(instruction);
                this.readed[NR] = true;
                Tts.getInitStatus().then(() => {
                     Tts.speak(instruction);
                }, (err) => {
                if (err.code === 'no_engine') {
                    Tts.requestInstallEngine();
                }
                });
                
            }
  
            
    }
        
    

}