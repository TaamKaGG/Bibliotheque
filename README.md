## Welcome to my Bibliotheque project ##

While reading the documentation, I stumbled against the installation process (combining Docker and Symfony CLI is not making the API working at all), and I had trouble to understand the workflow of ApiPlatform and its components (such as the Client or the Admin), and therefore had extreme misunderstanding of the needs for the app asked.

I figured it out way too late, and manage to only make the API work and a few views, such as a home page leading to Book List, Reviews and Categories. Unfortunatelly, I couldn't get a clue on why my data from my database would't show up in the lists, while being accessible with a direct link.


## Steps to install and launch the project ##
After pulling the git repository, go inside the Bibliotheque project folder and check, in the .env, the DATABASE_URL to make it match your needs. I personnaly used Docker and a PostgreSQL container to use it.
Once the Database URL seems to be working, launch the update.sh bash file and seat back while Symfony, Nuxt and their dependencies are being installed.

At the end, the "yarn dev -o" command will automatically open the localhost for you and allow you to use the app.

## A few notes ##
As I said previously, I ran out of time and failed the task completly.
If you need to check if the create, update, delete fonctionnalities work, you will need to get to them via the URL (for example : http://localhost:3000/books/4 to access the Show page of book id 4)
Their are 3 entities (and API Resources) : Book, Review and Categorie.

## A final note ##
I'm extremely disappointed in myself for not having achieved the objectives you asked for, and I'm deeply sorry if you feel betrayed, especially after the call we had last week.
I have not many excuses, beside being really tired from my job, and not having much time to allocate to the project.
