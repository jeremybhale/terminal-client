const io = require('socket.io')()

const port = process.env.PORT || 8000
io.listen(port)

function resetNotes() {
	notes = [{
		id: 0,
		user: "LKoltz",
		note: "You've done it!"
	}]
}

var notes = []
resetNotes()

io.on('connection', (client) => {
	console.log("Connected")
	io.to(client.id).emit('join', {
		notes: notes
	})
	
	client.on('addNote', newMessage => {
		var str = newMessage.note.substring(0, 3) == "$!$"
		
		if(str) {
			var cmd = newMessage.note.split(" ")
			
			switch(cmd[0]) {
				case "$!$changeusername":
					io.to(client.id).emit('cUN', cmd[1])
					break
				case "$!$clearterminal":
					resetNotes()
					break
			}
			
		} else {
			notes.push(newMessage)
			io.emit('newNote', newMessage)
		}
	})
});