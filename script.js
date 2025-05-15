 const folders = {};
  const favourites = [];
  let editMode = false;
  let editFolder = null;
  let editIndex = null;

  function showPage(id) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    hideNotification();
    document.getElementById(id).classList.remove('hidden');
    if (id === 'favourites') displayFavourites();
    if (id === 'folders') displayFolders();
  }

  function formatCapitalSentences(text) {
    return text.replace(/(?:^|[.!?]\s+)([a-z])/g, (match, p1) => match.replace(p1, p1.toUpperCase()));
  }

  document.getElementById('story-input').addEventListener('input', () => {
    const text = document.getElementById('story-input').value.trim();
    const wordCount = text.length > 0 ? text.trim().split(/\s+/).length : 0;
    document.getElementById('word-count').textContent = wordCount;
  });

  document.getElementById('save-btn').addEventListener('click', () => {
    let storyText = document.getElementById('story-input').value.trim();
    const folderName = document.getElementById('folder-name').value.trim() || 'Uncategorized';
    const storyTitle = document.getElementById('story-title').value.trim();
    const date = new Date().toLocaleString();

    if (!storyText || !storyTitle) {
      alert("Please write something and add a title!");
      return;
    }

    storyText = formatCapitalSentences(storyText);

    if (editMode) {
      folders[editFolder][editIndex].storyText = storyText;
      folders[editFolder][editIndex].storyTitle = storyTitle;
      folders[editFolder][editIndex].date = date;
      showNotification("Story updated successfully!");
      editMode = false;
      editFolder = null;
      editIndex = null;
      document.getElementById('save-btn').innerHTML = '<i class="fas fa-save"></i> Save Story';
    } else {
      if (!folders[folderName]) folders[folderName] = [];
      folders[folderName].push({ storyText, storyTitle, date });
      showNotification("Story saved successfully!");
    }

    document.getElementById('story-input').value = '';
    document.getElementById('story-title').value = '';
    document.getElementById('folder-name').value = '';
    document.getElementById('word-count').textContent = '0';
    displayFolders();
  });

  function displayFolders() {
    const container = document.getElementById('folders-list');
    container.innerHTML = '';

    Object.entries(folders).forEach(([folderName, stories]) => {
      const folderDiv = document.createElement('div');
      folderDiv.innerHTML = `<h3>${folderName} <button onclick="deleteFolder('${folderName}')">Delete Folder</button></h3>`;
      stories.forEach((story, index) => {
        const storyDiv = document.createElement('div');
        storyDiv.className = 'saved-story';
        storyDiv.innerHTML = `
          <h4>${story.storyTitle}</h4>
          <p>${story.storyText.replace(/\n/g, "<br>")}</p>
          <small>${story.date}</small>
        `;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => startEditing(folderName, index));

        const favBtn = document.createElement('button');
        favBtn.textContent = 'Favourite';
        favBtn.addEventListener('click', () => addToFavourites(story));

        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download';
        downloadBtn.addEventListener('click', () => downloadStory(story));

        storyDiv.appendChild(editBtn);
        storyDiv.appendChild(favBtn);
        storyDiv.appendChild(downloadBtn);

        folderDiv.appendChild(storyDiv);
      });
      container.appendChild(folderDiv);
    });
  }

  function startEditing(folderName, index) {
    const story = folders[folderName][index];
    document.getElementById('story-input').value = story.storyText;
    document.getElementById('story-title').value = story.storyTitle;
    document.getElementById('folder-name').value = folderName;
    document.getElementById('save-btn').innerHTML = 'Update Story';
    editMode = true;
    editFolder = folderName;
    editIndex = index;
    showPage('write');
  }

  function addToFavourites(story) {
    if (!favourites.includes(story)) {
      favourites.push(story);
      showNotification("Added to favourites!");
    } else {
      showNotification("Already in favourites!");
    }
  }

  function displayFavourites() {
    const container = document.getElementById('favourites-list');
    container.innerHTML = '';
    favourites.forEach(story => {
      const favDiv = document.createElement('div');
      favDiv.className = 'saved-story';
      favDiv.innerHTML = `
        <h4>${story.storyTitle}</h4>
        <p>${story.storyText.replace(/\n/g, "<br>")}</p>
        <small>${story.date}</small>
      `;
      container.appendChild(favDiv);
    });
  }

  function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(hideNotification, 3000);
  }

  function hideNotification() {
    document.getElementById('notification').style.display = 'none';
  }

  function deleteFolder(folderName) {
    delete folders[folderName];
    displayFolders();
  }

  function downloadStory(story) {
    const blob = new Blob([story.storyText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${story.storyTitle}.txt`;
    link.click();
  }

  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }