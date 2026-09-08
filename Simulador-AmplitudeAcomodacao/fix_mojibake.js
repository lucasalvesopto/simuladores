const fs = require('fs');

function fixMojibake(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Create a dictionary of known corrupted words -> correct words
    const dictionary = {
        'MÃƒÂ©todo': 'Método',
        'MÃÂ©todo': 'Método',
        'botÃƒÂ£o': 'botão',
        'botÃ£o': 'botão',
        'EsfÃƒÂ©rico': 'Esférico',
        'EsfÃ©rico': 'Esférico',
        'CilÃƒÂ­ndrico': 'Cilíndrico',
        'CilÃ­ndrico': 'Cilíndrico',
        'AcessÃƒÂ³rias': 'Acessórias',
        'AcessÃ³rias': 'Acessórias',
        'PosiÃƒÂ§ÃƒÂ£o': 'Posição',
        'PosiÃ§Ã£o': 'Posição',
        'AcomodaÃƒÂ§ÃƒÂ£o': 'Acomodação',
        'AcomodaÃ§Ã£o': 'Acomodação',
        'visÃƒÂ£o': 'visão',
        'visÃ£o': 'visão',
        'VisÃƒÂ£o': 'Visão',
        'VisÃ£o': 'Visão',
        'padrÃƒÂ£o': 'padrão',
        'padrÃ£o': 'padrão',
        'nÃƒÂ£o': 'não',
        'nÃ£o': 'não',
        'NÃƒÂ£o': 'Não',
        'NÃ£o': 'Não',
        'vocÃƒÂª': 'você',
        'vocÃª': 'você',
        'estÃƒÂ¡': 'está',
        'estÃ¡': 'está',
        'jÃƒÂ¡': 'já',
        'jÃ¡': 'já',
        'ÃƒÂºltima': 'última',
        'Ãºltima': 'última',
        'ÃƒÂ©': 'é',
        'Ã©': 'é',
        'ÃƒÂ¡': 'á',
        'Ã¡': 'á',
        'ÃƒÂ³': 'ó',
        'Ã³': 'ó',
        'ÃƒÂ­': 'í',
        'Ã­': 'í',
        'ÃƒÂ§': 'ç',
        'Ã§': 'ç',
        'ÃƒÂ£': 'ã',
        'Ã£': 'ã'
    };

    for (const [corrupted, correct] of Object.entries(dictionary)) {
        content = content.split(corrupted).join(correct);
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed: ' + filePath);
}

fixMojibake('greens.js');
fixMojibake('greens.html');
