function SaveAsFile(t,f,m) {
    try {
        var b = new Blob([t],{type:m});
        saveAs(b, f);
    } catch (e) {
        window.open("data:"+m+"," + encodeURIComponent(t), '_blank','');
    }
}


var chron = null
var playTime = null
var pauseTime = null
class coursChrono {
    constructor(){
        this.initializeTimer = new Date().getTime()
        this.pauseStartedAt = 0;
        this.pauseEndedAt = 0;
        this.notes = {};
        this.idNumber  = 0;
        this.haveBeenPaused = false;
        this.savedText = ""
    }
    printInitializeTimer(){
        console.log(this.initializeTimer);
    }

    calcTemps(){
        this.actualTime = new Date().getTime();
        var timeDifference = ((this.actualTime - this.initializeTimer)/1000);
        this.seconds = timeDifference % 60
        this.minutes = (timeDifference / 60)%60
        this.hours = (timeDifference/3600);

        this.lastTime = Math.floor(this.hours).toString() + ":" + Math.floor(this.minutes).toString() + ":" + Math.floor(this.seconds).toString()
        return Math.floor(this.hours).toString() + ":" + Math.floor(this.minutes).toString() + ":" + Math.floor(this.seconds).toString() 
    }

    pauseBegin(){
        this.pauseStartedAt = new Date().getTime();

    }
    pauseEnd(){
        if (this.haveBeenPaused){
        this.pauseEndedAt = new Date().getTime()
        this.initializeTimer += (this.pauseEndedAt - this.pauseStartedAt)
        this.pauseEndedAt = 0;
        this.pauseStartedAt = 0;
    }
}

    writeText(){
       const notesKey = Object.keys(this.notes);
        //console.log(JSON.stringify(notesKey));
        for (const it in notesKey){
            //console.log(note);
            this.savedText += ("-" + this.notes[notesKey[it]]['time'] + " : " + this.notes[notesKey[it]]["note"] + "\n");
        }
        return this.savedText;
    }


    clearBuffer(){
        this.savedText = ""
    }

    addNewNoteField(){
        $(".noteZone").append("<div class='container notearea' id = 'note-"+this.idNumber+"'><div class ='timeOfNote'>" + this.lastTime + "</div><textarea class = 'form-control' type = 'text'></textarea></div>")
        this.idNumber +=1
    }
    saveNotes(id){
        this.notes[id] = 
        {"time": $("#"+id+" .timeOfNote").text(), "note" : $("#"+id+" textarea").val().toString() }
        
    }
    setTime(typeTime){
        this.timerSetCurrentSelectionValue = Number($("."+typeTime).html())
        $("."+typeTime).html((this.timerSetCurrentSelectionValue +1).toString())
    }

    adjustTime(){
        this.initializeTimer = new Date().getTime() - (Number($('.hours').html())*3600 - Number($('.minutes').html())*60 - Number($('.seconds').html()))*1000
    }


    }
$(document).ready(function () {

$("i.play").click(()=>{
    clearInterval(pauseTime);
    pauseTime = null;
    if (!chron){
          chron = new coursChrono();
    }
    chron.pauseEnd()
    chron.haveBeenPaused = false;
    if (!playTime){
    playTime = setInterval(()=>{$("#temps").html(chron.calcTemps())},1000);
    }
    $(".play").toggleClass("hidden");
    $(".pause").toggleClass("hidden");
})
$('i.pause').click(()=>{
    clearInterval(playTime);
    playTime = null;
    $(".play").toggleClass("hidden");
    $(".pause").toggleClass("hidden");
    chron.pauseBegin()
    chron.haveBeenPaused = true;
})
$(".note").click(()=>{
    chron.addNewNoteField()
})
$("i.save").click(()=>{
    var noteDate = new Date()
    SaveAsFile(chron.writeText(),(noteDate.toString())+".txt","text/plain;charset=utf-8");
    chron.clearBuffer()
})
})

$(document).on("change",'.noteZone textarea',()=>{
    $(".noteZone textarea").each((i)=>{
        chron.saveNotes("note-"+i)
    })
    console.log(chron.notes)
})