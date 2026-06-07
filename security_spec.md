# Security Specification for Harmee Social Firestore Rules

## 1. Data Invariants

1. **User Ownership**: A user document under `/users/{userId}` can only be written by the authenticated user whose `request.auth.uid == userId`.
2. **Video Integrity**: Videos can be posted by any signed-in user, but their `user.id` must match `request.auth.uid`. No user can edit or delete another user's posted videos.
3. **Likes & Comments**: Users can update the `likesCount` or `comments` list on any video, but only if they don't alter other fields (like the creator's user object, video URL, etc.), or spoof identities inside comment maps.
4. **Chat Privacy**: A chat channel under `/chats/{chatId}` can only be read or updated by participants.
5. **Notification Guard**: Recipients can only see notifications addressed to them, e.g. `recipientId == request.auth.uid`.

---

## 2. The "Dirty Dozen" Spoof Payloads

Here are twelve hypothetical payloads aimed at testing boundary limits, identity hacking, and state shortcutting. The Firestore rules will reject every single one of these:

1. **User Identity Spoofing**: Attempt to write a profile under `/users/attacker_uid` where `request.auth.uid == 'victim_uid'`.
2. **Immortality Field Bypass**: Attempt to update details or create a user profile with an invalid `followersCount` set extremely high manually without follow relations.
3. **Ghost Status Injection**: Attempt to create/modify a video post with an added malicious field `isVerifiedByAdmin: true` to spoof credentials of verified badges.
4. **Video Hijack / Overwrite**: User `attacker_uid` attempts to update/overwrite the `videoUrl` or `thumbnailUrl` of a video owned by user `victim_uid`.
5. **Identity Spoofed Commenting**: Attempting to add a comment with `username: "victim_celeb"` when authenticated as `attacker_uid`.
6. **Relational Path Poisoning**: Attempt to set a custom string of 1.5KB instead of actual `videoId` (like nested paths with illegal characters).
7. **Denial of Wallet (Huge String)**: Attempt to post a caption or comment body exceeding 2000 characters.
8. **Client Time Spoofing**: Attempt to submit custom `createdAt` or `updatedAt` field with arbitrary values instead of using the mandatory server timestamp `request.time`.
9. **Chat Sniffing / Reading**: Attacker attempts to list or get `/chats/chat_private_room` where they are not a sender or recipient.
10. **Chat Impersonation**: Attacker attempts to append a message to `/chats/room_id` with `senderId: 'victim_uid'`.
11. **Notification Hijacking**: Attacker attempts to read `/notifications/alert_123` targeted to `victim_uid`.
12. **Blanket Query Abuse**: Attempt to execute a query on `/notifications` or `/chats` without specifying the recipient filtering in the client-side `where()` constraints, hoping the backend drops the whole collection.

---

## 3. Testing Rules Verification Strategy

A `firestore.rules.test.ts` structure is designed to isolate security rule branches and verify these constraints locally under simulation or unit-tests.
For production reliability, our main `firestore.rules` file enforces these validations at the ingress security layer of Cloud Firestore.
