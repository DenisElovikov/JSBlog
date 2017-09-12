const Article = require('mongoose').model('Article');

module.exports = {
    createGet: (req, res) => {
        res.render('article/create');
    },

    createPost: (req, res) => {
        //console.log(req.body);
        let articleArgs = req.body;

        let errorMsg = '';

        if (!req.isAuthenticated()) {
            errorMsg = 'You should be logged in to make articles!';
        }else if (!articleArgs.title) {
            errorMsg = 'Invalid title!';
        }else if (!articleArgs.content) {
            errorMsg = 'Invalid content!';
        }

        if (errorMsg) {
            res.render('article/create', {error: errorMsg});
            return;
        }

        articleArgs.author = req.user.id;
        // let userId =  req.user.id;
        // console.log(userId);
        Article.create(articleArgs).then(article => {
            //articles from User.js
            req.user.articles.push(article.id);
            req.user.save(err => {
                if (err) {
                    res.redirect('/', {error: err.message});
                }else {
                    res.redirect('/');
                }
            });
        });
    },

    detailsGet: (req, res) => {
        let id = req.params.id;

        Article.findById(id).populate('author').then(article =>{
            res.render('article/details', article);
        })
    }
};