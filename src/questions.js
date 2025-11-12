// Questions data structure
// Each category has 5 questions with increasing point values: 200, 400, 600, 800, 1000

const QUESTIONS = [
    {
        category: "Science",
        questions: [
            {
                question: "This is the chemical symbol for water",
                answer: "What is H2O?",
                value: 200
            },
            {
                question: "This planet is known as the Red Planet",
                answer: "What is Mars?",
                value: 400
            },
            {
                question: "This is the speed of light in a vacuum",
                answer: "What is 299,792,458 meters per second?",
                value: 600
            },
            {
                question: "This is the most abundant gas in Earth's atmosphere",
                answer: "What is nitrogen?",
                value: 800
            },
            {
                question: "This is the smallest unit of matter",
                answer: "What is an atom?",
                value: 1000
            }
        ]
    },
    {
        category: "History",
        questions: [
            {
                question: "This war was fought from 1914 to 1918",
                answer: "What is World War I?",
                value: 200
            },
            {
                question: "This ancient wonder was located in Alexandria, Egypt",
                answer: "What is the Lighthouse of Alexandria?",
                value: 400
            },
            {
                question: "This emperor built a wall across northern Britain",
                answer: "Who is Hadrian?",
                value: 600
            },
            {
                question: "This battle marked the turning point of the Civil War",
                answer: "What is the Battle of Gettysburg?",
                value: 800
            },
            {
                question: "This city was the capital of the Byzantine Empire",
                answer: "What is Constantinople?",
                value: 1000
            }
        ]
    },
    {
        category: "Literature",
        questions: [
            {
                question: "This author wrote '1984' and 'Animal Farm'",
                answer: "Who is George Orwell?",
                value: 200
            },
            {
                question: "This is the name of the protagonist in 'Moby Dick'",
                answer: "Who is Ishmael?",
                value: 400
            },
            {
                question: "This Shakespeare play features the characters Romeo and Juliet",
                answer: "What is Romeo and Juliet?",
                value: 600
            },
            {
                question: "This novel begins with 'It was the best of times, it was the worst of times'",
                answer: "What is A Tale of Two Cities?",
                value: 800
            },
            {
                question: "This is the first book in J.R.R. Tolkien's 'The Lord of the Rings' trilogy",
                answer: "What is The Fellowship of the Ring?",
                value: 1000
            }
        ]
    },
    {
        category: "Geography",
        questions: [
            {
                question: "This is the longest river in the world",
                answer: "What is the Nile River?",
                value: 200
            },
            {
                question: "This is the smallest country in the world",
                answer: "What is Vatican City?",
                value: 400
            },
            {
                question: "This mountain range separates Europe and Asia",
                answer: "What are the Ural Mountains?",
                value: 600
            },
            {
                question: "This is the capital of Australia",
                answer: "What is Canberra?",
                value: 800
            },
            {
                question: "This is the deepest ocean trench in the world",
                answer: "What is the Mariana Trench?",
                value: 1000
            }
        ]
    },
    {
        category: "Entertainment",
        questions: [
            {
                question: "This actor played Tony Stark in the Marvel Cinematic Universe",
                answer: "Who is Robert Downey Jr.?",
                value: 200
            },
            {
                question: "This TV show is set in the fictional town of Westeros",
                answer: "What is Game of Thrones?",
                value: 400
            },
            {
                question: "This director made 'Inception' and 'The Dark Knight'",
                answer: "Who is Christopher Nolan?",
                value: 600
            },
            {
                question: "This band released the album 'Abbey Road'",
                answer: "Who are The Beatles?",
                value: 800
            },
            {
                question: "This is the highest-grossing film of all time",
                answer: "What is Avatar?",
                value: 1000
            }
        ]
    },
    {
        category: "Sports",
        questions: [
            {
                question: "This sport is played at Wimbledon",
                answer: "What is tennis?",
                value: 200
            },
            {
                question: "This team won the first Super Bowl",
                answer: "Who are the Green Bay Packers?",
                value: 400
            },
            {
                question: "This is the number of players on a basketball team on the court",
                answer: "What is 5?",
                value: 600
            },
            {
                question: "This country has won the most World Cup titles in soccer",
                answer: "What is Brazil?",
                value: 800
            },
            {
                question: "This is the length of a marathon in miles",
                answer: "What is 26.2 miles?",
                value: 1000
            }
        ]
    }
];

// Point values for questions (standard Jeopardy format)
const POINT_VALUES = [200, 400, 600, 800, 1000];
