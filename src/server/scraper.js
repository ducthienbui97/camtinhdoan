var Scraper = function(url) {
    var casper = require('casper').create();
    var currentPage = 1;
    var links = [];

    var getLinks = function() {
        var rows = document.querySelectorAll('h3 a');
        links = [];

        for (var i = 0, e; e = rows[i]; i ++) {
            console.log(i);
            var link = {};
            link['title'] = e.innerText;
            link['url'] = e.getAttribute('href');
            links.push(link);
        }
        return links;
    };

    var terminate = function() {
        return this.echo("Terminating...").exit();
    }

    var getSelectedPage = function() {
        var p = document.querySelector('a.active.no-log');
        return parseInt(p.textContent);
    }

    var processPage = function() {
        links = this.evaluate(getLinks);
        require('utils').dump(links);

        if (currentPage >= 5 || !this.exists('h3 a')) {
            return terminate.call(casper);
        }

        currentPage ++;
        
        this.thenClick('.next').then(function() {
            this.waitFor(function() {
                return currentPage === this.evaluate(getSelectedPage);
            }, processPage, terminate);
        });
    };

    

    casper.start(url);
    casper.waitForSelector('h3 a', processPage);
    casper.run();
};

s = new Scraper("https://coccoc.com/search#query=bai+thu+hoach+cam+tinh+doan");
