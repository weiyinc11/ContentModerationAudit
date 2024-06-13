# Platform List

This file includes all platforms considered for the Content Moderation Research Project. 
Each row describes a platform's access link, account creation method, and proposed method(s) of creating a controlled and closed environment.
An exploration of each platform's content moderation systems will also be put in place. 

### Platform Criteria


### Platform Table

<table>
  <tr>
   <td><strong>Platform</strong>
   </td>
   <td><strong>Account Creation</strong>
   </td>
   <td><strong>Closed Environment Creation</strong>
   </td>
   <td><strong>Pros and Cons</strong>
   </td>
   <td><strong>Content Moderation System</strong>
   </td>
  </tr>
  <tr>
   <td>Youtube
   </td>
   <td>Via Email + Phone Number required for live streaming
   </td>
   <td>1. Creating a private stream that is only visible to those emails you provide in the private stream to option. 
<p>
2. Uploading unlisted or private videos which can only be seen by people who have a link or only by the creator. 
   </td>
   <td>Private Stream: 
<p>
- Allows for a much quicker upload and testing cycle
<p>
- Requires a phone number to be approved to stream
<p>
Private / Unlisted Videos: 
<p>
- More explicit information about it content moderation → options like ‘Is it made for kids’ and Copyright protection
<p>
- Slower upload and may be too large of a ‘release environment’ 
   </td>
   <td>- <a href="https://www.youtube.com/howyoutubeworks/policies/community-guidelines/">Community Guidelines</a>: 
<p>
Fake Engagement Policy, Hate Speech Policy:  \
​​Here are examples of hate speech not allowed on YouTube.
<p>
-------------
<p>
“I’m glad this [violent event] happened. They got what they deserved [referring to people with protected group status].”
<p>
“[People with protected group status] are dogs” or “[people with protected group status] are like animals.”
<p>
 -------------
<p>
- <a href="https://themarkup.org/automated-censorship/2024/03/01/how-automated-content-moderation-works-even-when-it-doesnt-work">How it works</a> and
<p>
<a href="https://journals.sagepub.com/doi/10.1177/2053951719897945">Paper on Perceptual Hashing for Copyright Policies</a>
<p>
Many diff automated systems scan for patterns / how to treat these patterns that match harmful content from a “Hash Database” 
   </td>
  </tr>
  <tr>
   <td>Linkedin
   </td>
   <td>Via Email 
   </td>
   <td>Private Unlisted Groups on Linkedin allow for just the group owner and invited members to view posts and group content
   </td>
   <td>- Smaller release environment 
<p>
- Greater controls due to the Group Owner being able to moderate content / identify the Group Rules
<p>
- It may take a long upload cycle for each post. 
   </td>
   <td>- <a href="https://www.linkedin.com/legal/professional-community-policies">Professional Community Guidelines: </a>
<p>
“Be Safe” clause - hate speech and no exploitation of children (specifically) 
<p>
“Be Trustworthy” - Impersonation and misinformation
<p>
<a href="https://www.linkedin.com/blog/engineering/trust-and-safety/augmenting-our-content-moderation-efforts-through-machine-learni">New framework for reviewing content</a>: 
<p>
- Utilizing AI to automate prioritization of content review for human reviewers
<p>
(interesting)
   </td>
  </tr>
  <tr>
   <td>Discord
   </td>
   <td>Via Email
   </td>
   <td>Creating a <a href="https://support.discord.com/hc/en-us/articles/206143407-How-do-I-set-up-a-private-server">private server</a> with permission for everyone disabled
   </td>
   <td>- closed environment only between server-leader and members
<p>
- able to set up different channels for testing each policy
<p>
- more explicit automated moderator → <a href="https://discord.com/safety/auto-moderation-in-discord#:~:text=Built%2Din%20moderation%20features,will%20find%20the%20Moderation%20settings.">AutoMod</a> for quicker response times on flagging harmful content
<p>
- Perhaps able to customize reactions of autoMod 
   </td>
   <td><a href="https://discord.com/guidelines">- Community guidelines</a>:
<p>
- <a href="https://discord.com/safety/our-approach-to-content-moderation">Approach to Moderation</a>:
<p>
Image hashing and “ML powered tech” for child sexual abuse material
<p>
+ 
<p>
Metadata and network patterns to identify bad actors or spaces with harmful content / activity. (keyword filters) 
   </td>
  </tr>
  <tr>
   <td>Pinterest
   </td>
   <td>Email
   </td>
   <td>Creating a private board of pins (Interesting to look into further.. Removing pins from a board that seem inappropriate via an automated system but aren’t pins public?) 
   </td>
   <td>- things may be secretly flagged as harmful content but not able to see this unless you view with another account – outside the board
   </td>
   <td>- <a href="https://medium.com/pinterest-engineering/how-pinterest-fights-misinformation-hate-speech-and-self-harm-content-with-machine-learning-1806b73b40ef">Content moderation</a> happens on the level of a pin- grouping similar images together but also on a board level where each board is provided a score 
   </td>
  </tr>
  <tr>
   <td>Facebook
   </td>
   <td>Email
   </td>
   <td>Creating a private facebook group. 
   </td>
   <td>- able to manage and test moderation on various mediums within the closed facebook group: Community chats, reels, music, files, and live videos. 
<p>
- distinguish between content that is not allowed and sensitive content 
   </td>
   <td><a href="https://transparency.meta.com/en-gb/policies/community-standards/">Content moderation</a>: (Hate speech) 
<p>
- “Generalization that state inferiority (in written or visual form): Physical deficiencies are defined as those about: Hygiene, including, but not limited to: filthy, dirty, smelly or Physical appearance, including, but not limited to: ugly, hideous”
<p>
- “Animals in general or specific types of animals that are culturally perceived as intellectually or physically inferior (including but not limited to: Black people and apes or ape-like creatures; Jewish people and rats; Muslim people and pigs; Mexican people and worms)”
<p>
<a href="https://transparency.meta.com/en-gb/enforcement/detecting-violations/how-enforcement-technology-works/">Enforcement</a> (combination of tech and human review): 
<p>
- Determine if content is under hate speech or violent
<p>
- Determine action to delete / human review
<p>
Identifying subtle changes and details in miscommunication - images, item placement or word choice**  
   </td>
  </tr>
</table>
