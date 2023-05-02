const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
 
firebase.initializeApp(firebaseConfig);
 
const storage = firebase.storage();
const database = firebase.database();
const musicListRef = database.ref('musicList');
const musicFilesRef = storage.ref('musicFiles');
 
document.getElementById('uploadForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const musicFile = document.getElementById('musicFile').files[0];
    uploadMusic(musicFile);
});
 
function uploadMusic(musicFile) {
    const uploadTask = musicFilesRef.child(musicFile.name).put(musicFile);
 
    uploadTask.on('state_changed', (snapshot) => {
        // Handle progress
    }, (error) => {
        console.error('Upload error:', error);
    }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            const newMusicRef = musicListRef.push();
            newMusicRef.set({
                name: musicFile.name,
                url: downloadURL
            });
        });
    });
}
 
function createMusicListItem(music) {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    listItem.textContent = music.name;
 
    const toggleButton = document.createElement('button');
    toggleButton.className = 'btn btn-sm btn-outline-primary';
    toggleButton.textContent = 'Select';
    toggleButton.onclick = () => {
        database.ref('selectedMusic').set(music.key);
    };
 
    listItem.appendChild(toggleButton);
    return listItem;
}
 
musicListRef.on('child_added', (snapshot) => {
    const music = snapshot.val();
    music.key = snapshot.key;
    const listItem = createMusicListItem(music);
    document.querySelector('#uploadedMusicList ul').appendChild(listItem);
});