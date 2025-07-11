export function formatTime(totalSeconds: number) {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return [hrs, mins, secs]
    .map((v) => v.toString().padStart(2, "0"))
    .join(":");
} 

export function currentFormattedDate(){
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  // Format: YYYY-MM-DD HH:mm
  const formattedDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  return formattedDateTime;
}