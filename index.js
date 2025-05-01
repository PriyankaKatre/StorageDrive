import { readdir, open, readFile } from 'fs/promises';
import http from 'http';

const server = http.createServer(async (req, res) => {
  
    if(req.url === '/') {
        const dirContent = await readdir('./');
        let dynamicHtml = ''
        dirContent.forEach(content => {
            dynamicHtml+= `<a href='./${encodeURIComponent(content)}'><li>${content}</li></a>\n`        })

        const htmlBoilerplateContent = await readFile('./index.html', 'utf-8');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(htmlBoilerplateContent.replace('${dynamicHtml}', dynamicHtml));
    }else{    
        try{
            const filePath = `.${decodeURIComponent(req.url)}`;
            const filehandle = await open(filePath);
            const stats = await filehandle.stat()
            if(stats.isDirectory()) {
                const dirContent = await readdir(`./${req.url}`);
                let dynamicHtml = ''
                
                dirContent.forEach(content => {
                    dynamicHtml += `<a href='.${req.url}/${encodeURIComponent(content)}'><li>${content}</li></a>\n`;
                });
    

                const htmlBoilerplateContent = await readFile('./index.html', 'utf-8');
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(htmlBoilerplateContent.replace('${dynamicHtml}', dynamicHtml));
            }else {
                const readStream = filehandle.createReadStream();
                readStream.pipe(res)
            }
            
        }catch(err){
            console.log(err);
            res.end('Not Found')
        }
    }
});
    

server.listen(4000, () => {
    console.log('app is running on server');
});
