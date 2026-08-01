export const welcomeEmailTemplate = (username) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Welcome to ChatApp</title>
</head>

<body style="margin:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

<div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">

    <!-- Header -->
    <div style="background:#6366f1;padding:45px;text-align:center;">
        <h1 style="margin:0;color:#ffffff;font-size:34px;">
            💬 ChatApp
        </h1>

        <p style="margin:12px 0 0;color:#e0e7ff;font-size:16px;">
            Welcome to the ChatApp family
        </p>
    </div>

    <!-- Content -->
    <div style="padding:40px;">

        <h2 style="margin-top:0;color:#111827;">
            Hi ${username},
        </h2>

        <p style="color:#4b5563;font-size:16px;line-height:28px;">
            Welcome aboard! 🎉
        </p>

        <p style="color:#4b5563;font-size:16px;line-height:28px;">
            Your account has been created successfully.
            We're excited to have you join the ChatApp community.
        </p>

        <p style="color:#4b5563;font-size:16px;line-height:28px;">
            You can now chat with friends, create groups,
            share images, send voice messages, and enjoy
            a fast and secure messaging experience.
        </p>

        <!-- Features -->

        <div style="margin:35px 0;padding:20px;background:#f9fafb;border-radius:12px;">

            <p style="margin:8px 0;">⚡ Real-time Messaging</p>
            <p style="margin:8px 0;">🔒 Secure Authentication</p>
            <p style="margin:8px 0;">👥 Group Conversations</p>
            <p style="margin:8px 0;">🖼 Image Sharing</p>
            <p style="margin:8px 0;">🎤 Voice Messages</p>
            <p style="margin:8px 0;">🌙 Beautiful Themes</p>

        </div>

        <div style="text-align:center;margin-top:35px;">

            <a
                href="http://localhost:5173"
                style="
                    display:inline-block;
                    background:#6366f1;
                    color:#ffffff;
                    text-decoration:none;
                    padding:14px 32px;
                    border-radius:8px;
                    font-weight:bold;
                "
            >
                Start Chatting
            </a>

        </div>

    </div>

    <!-- Footer -->

    <div style="padding:25px;text-align:center;background:#f9fafb;border-top:1px solid #e5e7eb;">

        <p style="margin:0;color:#6b7280;">
            Thanks for choosing ChatApp ❤️
        </p>

        <p style="margin:10px 0 0;color:#9ca3af;font-size:14px;">
            Happy Chatting 🚀
        </p>

    </div>

</div>

</body>
</html>
`;