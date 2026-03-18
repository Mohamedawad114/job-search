import { NotificationType } from '../Enum';
import { INotificationData } from '../Interfaces';

export const notificationHandler = (type: string, data: INotificationData) => {
  let title = '';
  let content = '';

  switch (type) {
    case NotificationType.JOB_ACCEPTED:
      title = 'Offer Received! 🎉';
      content = `Congrats! You have been accepted for the ${data.jobTitle} position at ${data.companyName}.`;
      break;

    case NotificationType.JOB_CAPACITY_FULL:
      title = 'Application Limit Reached 🛑';
      content = `The job ${data.jobTitle} is no longer accepting applications (Limit: ${data.maxCount}).`;
      break;

    case NotificationType.ROLE_CHANGED_TO_ADMIN:
      title = 'Role Updated 🛡️';
      content = `Your account permissions have been updated. You are now an Admin.`;
      break;

    case NotificationType.NEW_JOB_POSTED:
      title = 'New Job Opportunity 💼';
      content = `${data.companyName} just posted a new opening for ${data.jobTitle}. Check it out!`;
      break;

    default:
      title = 'New Notification 🔔';
      content = 'You have a new update in your dashboard.';
      break;
  }

  return { title, content };
};
