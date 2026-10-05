// Sample data used by `npm run init-db`.
// Every account below is for testing only - change the passwords before putting this online.

const users = [
    { name:"Admin",          email:"admin@learnhub.com",   password:"admin12345",   role:"admin"   },
    { name:"Aarav Patel",    email:"aarav@learnhub.com",   password:"student123",   role:"student" },
    { name:"Diya Shah",      email:"diya@learnhub.com",    password:"student123",   role:"student" },
    { name:"Rohan Mehta",    email:"rohan@learnhub.com",   password:"student123",   role:"student" },
    { name:"Isha Desai",     email:"isha@learnhub.com",    password:"student123",   role:"student" },
];

// image_url points at the pictures in public/images. The YouTube ids are sample content:
// if one ever stops playing, edit that course from the admin dashboard.
const courses = [
    {
        title:"Python Programming for Beginners",
        description:"Learn Python from scratch - variables, loops, functions, files and small real projects.",
        category:"Programming",
        youtube_video_id:"rfscVS0vtbw",
        youtube_playlist_id:"",
        video_count:1,
        image_url:"/images/Python-Programming-For-Beginners.jpg",
    },
    {
        title:"Full Stack Web Development",
        description:"Build modern websites end to end - JavaScript fundamentals, then front end, back end and databases.",
        category:"Web Development",
        youtube_video_id:"PkZNo7MFNFg",
        youtube_playlist_id:"",
        video_count:1,
        image_url:"/images/full-stack-web-development.jpg",
    },
    {
        title:"Machine Learning Essentials",
        description:"A friendly introduction to machine learning: supervised learning, neural networks and real examples.",
        category:"Data Science",
        youtube_video_id:"i_LwzRVP7bg",
        youtube_playlist_id:"",
        video_count:1,
        image_url:"/images/machine-learning.jpeg",
    },
    {
        title:"Data Science with SQL",
        description:"Query, join and analyse data with SQL - the first tool every data scientist needs.",
        category:"Data Science",
        youtube_video_id:"HXV3zeQKqGY",
        youtube_playlist_id:"",
        video_count:1,
        image_url:"/images/data-science.jpg",
    },
    {
        title:"Cyber Security & Ethical Hacking",
        description:"Understand how attackers think and how to protect systems, networks and websites.",
        category:"Cyber Security",
        youtube_video_id:"3Kq1MIfTWCE",
        youtube_playlist_id:"",
        video_count:1,
        image_url:"/images/cyber-security.jpeg",
    },
    {
        title:"Python Tutorials - Full Playlist",
        description:"A complete playlist-style course: work through the whole series one video at a time.",
        category:"Programming",
        youtube_video_id:"",
        youtube_playlist_id:"PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU",
        video_count:15,
        image_url:"/images/Python-Programming-For-Beginners.jpg",
    },
];

// enrollments: [student email, course title, progress %, enrolled N days ago]
const enrollments = [
    ["aarav@learnhub.com", "Python Programming for Beginners", 100, 30],
    ["aarav@learnhub.com", "Full Stack Web Development",       60, 20],
    ["aarav@learnhub.com", "Machine Learning Essentials",      25, 3],
    ["diya@learnhub.com",  "Python Programming for Beginners", 75, 24],
    ["diya@learnhub.com",  "Data Science with SQL",            40, 12],
    ["rohan@learnhub.com", "Full Stack Web Development",       10, 9],
    ["rohan@learnhub.com", "Cyber Security & Ethical Hacking", 55, 6],
    ["isha@learnhub.com",  "Machine Learning Essentials",      90, 15],
    ["isha@learnhub.com",  "Python Tutorials - Full Playlist", 5,  1],
];

// feedback: [student email, course title, rating, comment]
const feedback = [
    ["aarav@learnhub.com", "Python Programming for Beginners", 5, "Clear explanations and great examples. Perfect first course!"],
    ["diya@learnhub.com",  "Python Programming for Beginners", 4, "Very beginner friendly, I would love more practice exercises."],
    ["isha@learnhub.com",  "Machine Learning Essentials",      5, "Finally understood how neural networks work."],
    ["rohan@learnhub.com", "Cyber Security & Ethical Hacking", 4, "Good overview, the hands-on part was my favourite."],
];

const contacts = [
    { name:"Meera Joshi", email:"meera@example.com", message:"Do you plan to add a course on mobile app development?" },
    { name:"Karan Verma", email:"karan@example.com", message:"The platform looks great. Is there a certificate after finishing a course?" },
];

module.exports = { users, courses, enrollments, feedback, contacts };
