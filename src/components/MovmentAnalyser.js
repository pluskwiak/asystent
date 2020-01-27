
function partial(func /*, 0..n args */) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var allArguments = args.concat(Array.prototype.slice.call(arguments));
    return func.apply(this, allArguments);
  };
}

class FIFO 
{
    length = 1;
    array = [];
    sumOfElements = 0;
    ready = true;

    constructor (FIFOLength)
    {
        this.length = FIFOLength;
     
    }
    
    clear()
    {
        this.array = [];
        this.sumOfElements = 0;
    }

    addElement (element)
    {
        this.array.push(element);
        this.sumOfElements += element; 
        if ((this.array.length>this.length) && (this.length != 0))
        {
            this.sumOfElements -= this.array.shift();
        }
    }

    std()
    {
        return 0.2;
    }
    mean()
    {
        return this.sumOfElements/this.array.length;
    }

    diff ()
    {
        let result= []
        for (let i = 1; i < this.array.length; i++)
        {
            result[i-1] = this.array[i]- this.array[i-1];
        }
        return result;
    }
}

function vectorLength(vector)
{
    x = vector.x * vector.x;
    y = vector.y * vector.y;
    z = vector.z * vector.z;

    return Math.sqrt(x+y+z);
}

export default class MovmentAnalyser 
{
    buffors = {};
    status = null;
    counter = 0;
    nr = 20;
    funNextStep = null;
    activeDevice = null;
    lastActiveDevice = null;
    ready = true;

    thasGoDown = false;
    thatGoUP = false;

    lastEventTime = null;

    agregateResults = null;
    constructor (nfun)
    {
       this.funNextStep = nfun;
       this.agregateResults = new FIFO(0);
       this.nr = 20;
       this.status= null;
       this.lastActiveDevice = null;
    }

    clearAllBuffors()
    {
        keys = Object.keys(this.buffors);
        keys.forEach(key => {
            if (typeof this.buffors[keys] !== 'undefined')
            {
                this.buffors[keys].clear();
            }
            
        });
    }

    setTypeAnalize(analize)
    {
        this.status = null;
        this.ready = false;
        this.agregateResults.clear();
        this.lastEventTime = null;
        setTimeout(
            function() {
                this.ready = true;
            }.bind(this), 1000);
        
        if ('hitting' == analize)
        {
            this.lastActiveDevice = this.activeDevice;
            this.clearAllBuffors();
            this.activeDevice = null;
        }
        if ('tramp' == analize)
        {
            this.clearAllBuffors();
            this.counter = 0;
            this.thatGoDown = false;
            this.thatGoUP = false;
            this.ready = true;
            
        }
        if ('standUp' == analize)
        {
            this.clearAllBuffors();
            this.standUpCounter = 0; 
            this.counter = 0;
        }
        this.status = analize;
        //console.log('analize typ:', this.status);
    }

    addDeviceAnalyzer(deviceID)
    {
        this.buffors[deviceID+'akc'] = new FIFO(this.nr);
        this.buffors[deviceID+'gyr'] = new FIFO(this.nr);
    }

    addSample (sample, deviceID)
    {
        if (this.ready)
        {
            if ((this.activeDevice == null) || (this.activeDevice == deviceID))
            {
                if(sample.akc != null)
                {   
                    if (Object.keys(this.buffors).includes(deviceID+'akc'))
                    {
                        this.buffors[deviceID+'akc'].addElement(vectorLength(sample.akc));
                    }
                }
                if(sample.gyr != null)
                {
                    this.buffors[deviceID+'gyr'].addElement(vectorLength(sample.gyr));
                }

                switch (this.status) {
                    case 'hitting':
                        if (this.buffors[deviceID+'akc'].array.length==this.nr)
                        {
                            if (this.itIsTaped(this.buffors[deviceID+'akc']))
                            {   
                                if (this.lastActiveDevice != deviceID)
                                {
                                    this.activeDevice = deviceID;
                                    //console.log ('taped: ',this.activeDevice);
                                    
                                    this.funNextStep();
                                }
                            
                            }
                        }
                        break;
                    case 'tramp':
                        if (this.buffors[deviceID+'akc'].array.length>5)
                        {
                            if ((this.buffors[deviceID+'akc'].array.slice(-1)-1)<(-0.1))
                            {
                            this.thatGoDown = true;     
                            }
                            if ((this.buffors[deviceID+'akc'].array.slice(-1)-1)>(0.2))
                            {
                                this.thatGoUP = true;     
                            }
                            //console.log(this.thatGoUP && this.thatGoDown);
                            if (this.itIsMaximum(this.buffors[deviceID+'akc']))
                            {
                                if (this.thatGoUP && this.thatGoDown)
                                {
                                    time = Date.now();
                                    if (this.lastEventTime != null)
                                    {
                                        let timeInterval = (time-this.lastEventTime)/1000;
                                        //console.log (timeInterval);
                                        this.agregateResults.addElement(timeInterval);
                                    }
                                    this.lastEventTime = time;
                                    this.counter += 1; 
                                    this.ready = false;
                                    this.thatGoDown = false;
                                    this.thatGoUP = false;
                                    setTimeout(
                                    function() {
                                        this.ready = true;
                                    }.bind(this), 100);
                                    this.funNextStep();
                                }
                                
                        }
                        }
                        break;
                    case 'standUp':
                        if (this.buffors[deviceID+'akc'].array.length==this.nr)
                        {
                            if ((this.buffors[deviceID+'akc'].array.slice(-1)-1)<(-0.1))
                            {
                            this.thatGoDown = true;     
                            }
                            if ((this.buffors[deviceID+'akc'].array.slice(-1)-1)>(0.2))
                            {
                                this.thatGoUP = true;     
                            }
                        if (this.itIsStandUp (this.buffors[deviceID+'akc']))
                        {
                            if (this.thatGoUP && this.thatGoDown)
                                {
                                    this.thatGoDown = false;
                                    this.thatGoUP = false;
                                    this.counter += 1;
                                    
                                    //console.log ("Pozycja zmieniona");

                                    this.ready = false;
                                    setTimeout(
                                    function() {
                                        this.ready = true;
                                    }.bind(this), 200);
                                    this.funNextStep();
                                }
                            
                        }
                        }
                        break;
                    default:
                        break;
                }
            }  
        }          
    }

    itIsMaximum(fifo)
    {
        let n = 3;
        data = fifo.array.slice(-n);

        let maxIndex = Math.round (n / 2);
        //console.log(this.ready);
        if (this.ready)
        {
             result = true;
    
    
            let sumDif = 0;
            for (var i = 0; i < (n-1); i++)
            {

                sumDif += (data[i+1]-data[i])
            }

            if (sumDif < (fifo.mean()*0.92))
            {
                result = false;
            }

            if (result)
            {
                for (var i = 0; i < n; i++)
                {
                    if (data[i]>data[maxIndex])
                    {
                        result = false;
                        break;
                    }
                }
            }
            
            if (result)
            {
                for (var i = 1; i < (maxIndex-1); i++)
                {
                    if (data[i]<data[i-1])
                    {
                        result = false;
                        break;
                    }
                }

                for (var i = maxIndex; i < (n-1); i++)
                {
                    if (data[i]<data[i+1])
                    {
                        result = false;
                        break;
                    }
                }
            }
        }
        else 
        {
            result = false;
        }
        return result;
    }

    itIsTaped(fifo)
    {
        if (this.ready)
        {
            //console.log(fifo);
            arraySd = fifo.std ();
            arrayMean = fifo.mean ();
            lastElement = fifo.array[fifo.array.length-1];
            
            if (Math.abs(lastElement-arrayMean)>arraySd*2)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    standUpCounter = 0;
    itIsStandUp(fifo)
    {
        let result = false;
        if (this.ready)
        {
            diff = fifo.diff();
            let sum = 0;
            for (let i = 0; i < diff.length; i++)
            {
                sum += diff[i]*diff[i];
            }
            
            if (sum>0.02)
            {
                this.standUpCounter += 1;
            }
           /* else if (sum > 0.55)
            {
                this.standUpCounter = 0;
                
            }*/
            else 
            {
                
                if ((this.standUpCounter > 3) && (this.standUpCounter < 60))
                {
                    result = true;
                    
                    this.agregateResults.addElement(this.standUpCounter);
                    this.standUpCounter = 0;
                }
                else
                {
                    this.standUpCounter = 0;
                }
            }
        }
        //
        return result;
    }
}