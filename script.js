document.getElementById('formElement').addEventListener('submit', function(e) {
    e.preventDefault();
    const content = document.getElementById('note').value;
    fetch('/notes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    })
    .then(response => response.json())
    .then(note => {
        addNoteToList(note);
        document.getElementById('note').value = '';
    });
});

function fetchNotes() {
    fetch('/notes')
        .then(response => response.json())
        .then(notes => {
                notes.forEach(note => addNoteToList(note));
        });
}
function addNoteToList(note) {
    const noteDiv = document.createElement('div');
    noteDiv.textContent = note.content;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => {
        fetch(`/notes/${note.id}`, {
            method: 'DELETE'
        }).then(() => {
            noteDiv.remove();
        });
    };
    noteDiv.appendChild(deleteButton);
    document.getElementById('listt').appendChild(noteDiv);
}
fetchNotes();
