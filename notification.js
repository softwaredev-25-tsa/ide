// Display a notification with icon, message, and auto-dismiss after 2 seconds
function showNotification(message, iconClass, color) {
  const container = document.getElementById("notif-container");

  const notification = document.createElement("div");
  notification.className = "notification";

  // Create and append icon element
  const iconElement = document.createElement("box-icon");
  iconElement.setAttribute("type", "solid");
  iconElement.setAttribute("size", "xs");
  iconElement.setAttribute("color", color);
  iconElement.setAttribute("name", iconClass);
  notification.appendChild(iconElement);

  // Create and append message element
  const messageElement = document.createElement("span");
  messageElement.textContent = message;
  notification.appendChild(messageElement);

  // Add close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  closeButton.className = "close-btn";
  closeButton.onclick = () => {
    notification.remove();
  };
  notification.appendChild(closeButton);

  container.appendChild(notification);

  // Automatically remove notification after 2 seconds
  setTimeout(() => {
    notification.remove();
  }, 2000);
}
