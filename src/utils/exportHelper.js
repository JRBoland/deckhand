// This function converts an array of song objects into a CSV formatted string
const convertToCSV = (playlist) => {
  // Define the headers for the CSV file
  const headers = ['Track #', 'Name', 'Artist', 'BPM', 'Key'];
  // Map each song object to a CSV row
  const rows = playlist.map((song, index) => 
    [
      index + 1,
      `"${song.name}"`, // Wrap in quotes to handle commas in names
      `"${song.artist}"`,
      song.bpm,
      song.key
    ].join(',')
  );

  // Combine headers and rows, separated by a newline
  return [headers.join(','), ...rows].join('\n');
};

// This function converts the playlist to a simple text format
const convertToTXT = (playlist) => {
  return playlist.map((song, index) => 
    `${index + 1}. ${song.artist} - ${song.name} (BPM: ${song.bpm}, Key: ${song.key})`
  ).join('\n');
};

// This is the main function that creates the file and triggers the download
export const exportPlaylistToFile = (playlist, fileType) => {
  let fileContent = '';
  let mimeType = '';
  let fileExtension = '';

  if (fileType === 'csv') {
    fileContent = convertToCSV(playlist);
    mimeType = 'text/csv';
    fileExtension = 'csv';
  } else { // Default to TXT
    fileContent = convertToTXT(playlist);
    mimeType = 'text/plain';
    fileExtension = 'txt';
  }

  // Create a Blob, which is a file-like object
  const blob = new Blob([fileContent], { type: mimeType });

  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor (link) element
  const a = document.createElement('a');
  a.href = url;
  a.download = `my-setlist.${fileExtension}`; // Set the desired filename
  
  // Programmatically click the link to trigger the download
  document.body.appendChild(a);
  a.click();
  
  // Clean up by removing the temporary link and URL
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};