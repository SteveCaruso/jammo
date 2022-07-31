# Jammo!
A quick, light-weight vanilla Javascript templating system.

*Jammo!* – pronounced "YAHM-muh" – is Neapolitan for "let's go!" (the cognate of the standard Italian *andiamo*). Most folk know the word from the old song *Funiculì, funiculà*.

The system is built in plain-old Javascript with zero dependencies and is designed to be extremely light-weight. 

You start out by building your `index.html` that serves as a template for all pages on your site, and it pulls new content from pages in the `html` directory and sticks that content into the appropriate places.

## Using It

First clone Jammo! into the root directory for the site.

Next, edit the `index.html` file with all of the basic structure you need for a template. It's best-practice to use the `<main>` tag to indicate where you want the body of your content to go, and be sure to include the `jammo.js` script in the `<head>`.

For example:

```
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="css/style.css">
    <title>The Main Page</title>

    <!-- This makes the magic happen -->
    <script src="js/jammo.js" defer></script>

</head>
<body>
    <!-- Main content will go here, so here's some dummy loading content. -->
    <main>
        <h1>Loading...</h1>
    </main>
</body>
</html>
```

Then set up your home page's content, in a file named `home.html` in the `html` directory, perhaps like this:

```
<!DOCTYPE html>
<html>
    <head>
        <title>The Home Page</title>
    </head>
    <body>
        <main>
            <h1>Home Page</h1>

            <p>And this is the home page content.</p>
        </main>
    </body>
</html>
```

Next, go into `jammo.js` and set up the `base` constant. This is what determines what content is pulled from where. To make this work you need at least two entries, like so:

```
const base = {
    "title" : document.title,
    "main"  : document.querySelector("main").innerHTML,
};
```

The keys are the queries for the different areas, and the values are the default content that will appear in them. Here we're just snagging what's in the `index.html` file's `<title>` and `<main>` respectively.

Once this is set, *Jammo!* will store that default content, and once it loads in a file from the `html` directory, it will pull any content from the same tags/queries and stick it into the `index.html` file in the same places.

## Linking

There are three ways to link between *Jammo!* pages:

### First - @Links

You can link to any internal page by using  `@`, followed by the name of the page, minus the `.html`.

So for example, if you were writing a link to `page.html`:

```
<a href="@page">Here is a link</a> to another internal page.
```

Using `@` links this way will only load in the new content and is the most efficient way to move around your site internally.

### Second ?jammo= Links

You can also pass the name of an internal page to the `jammo` GET variable, and the system will load it in. For example:

```
<a href="index.html?jammo=page">Here is a link</a> to another internal page via GET.
```

*Jammo!* will "redirect" to a cleaner URL, like with `@` links.

Keep in mind that linking this way may refresh the main page before loading the new content.

### Third Using `.htaccess`

If you're running off of an Apache server that can make use of the `.htaccess` file that's included. It will re-map any requests through the `jammo` GET method above, so all URLs will look clean.

## To Do List
- [] Handle HTTP errors (404, 500, etc.)
- [] Find an alternative to `.htaccess` for a `node.js` served site.