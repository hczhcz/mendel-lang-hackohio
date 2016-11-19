'use strict';

const ast1 = require('../libpepper/ast.1')
const ast2 = require('../libpepper/ast.2')
const typeInfo = require('../libpepper/type.info')
const typeCheck = require('../libpepper/type.check')

module.exports = (boot) => {
    //  __do(...)
    boot.namedModule(
        '__do', 'const', ast1.code(
            [], [], 'const', ast1.meta(
                (pass, instance) => {
                    return ast2.nativeOut(
                        {
                            js: (pass, target) => {
                                // nothing
                            }
                        },
                        typeInfo.basic('null')
                    );
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    );

    //　__assign('target', 'source')
    boot.namedModule(
        '__assign', 'const', ast1.code(
            ['target', 'source'], ['out', 'const'], '', ast1.meta(
                (pass, instance) => {
                    instance.accessIn(
                        'target',
                        instance.accessOut('source')
                    );

                    return ast2.nativeOut(
                        {
                            js: (pass, target) => {
                                pass.write('__self.set(\'target\', __self.get(\'source\'))');
                            }
                        },
                        typeInfo.basic('null')
                    );
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    );

    //  write('val')
    boot.namedModule(
        'write', 'const', ast1.code(
            ['val'], ['const'], '', ast1.meta(
                (pass, instance) => {
                    return ast2.nativeOut(
                        {
                            js: (pass, target) => {
                                pass.write('console.log(__self.get(\'val\'))');
                            }
                        },
                        typeInfo.basic('null')
                    );
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    );

    //  read('val')
    boot.namedModule(
        'read', 'const', ast1.code(
            ['val'], ['var'], '', ast1.meta(
                (pass, instance) => {
                    return ast2.nativeOut(
                        {
                            js: (pass, target) => {
                                pass.continuation(
                                    (returnId) => {
                                        pass.write(
                                        "const readline = require('readline');" +
                                            "const rl = readline.createInterface({" +
                                            "    input: process.stdin," +
                                            "    output: process.stdout" +
                                            "});" +
                                            "rl.question('', (answer) => {" +
                                            "    __self.set(\'val\', answer);" +
                                            "    rl.close();" +
                                            returnId + "();" +
                                                "})");
                                    },
                                    (returnId) => {
                                    }
                                );
                            }
                        },
                        typeInfo.basic('null')
                    );
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    );

    // __add('val1', 'val2')
    boot.namedModule(
        '__add', 'const', ast1.code(
            ['val1', 'val2'], ['const', 'const'], '', ast1.meta(
                (pass, instance) => {
                    let type1 = instance.accessOut('val1');
                    let type2 = instance.accessOut('val2');
                    if (typeCheck.visit(type1, type2) &&
                        typeCheck.visit(type1, typeInfo.basic('int'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') + __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('int')
                        )
                    }
                    else if (typeCheck.visit(type1, type2) &&
                             typeCheck.visit(type1, typeInfo.basic('float'))) {
                        return ast2.nativeOut(
                            {
                                js: (pass, target) => {
                                    pass.write(target('__self.get(\'val1\') + __self.get(\'val2\')'));
                                }
                            },
                            typeInfo.basic('float')
                        )
                    }
                    else {
                        throw Error();
                    }
                },
                (pass, instance, type) => {
                    throw Error();
                }
            )
        )
    )

    // // __index('container', 'index')
    // boot.namedModule(
    //     '__index', 'const', ast1.code(
    //         ['container', 'index'], ['const', 'const'], '', ast1.meta(
    //             (pass, instance) => {
    //                 if (typeCheck.visit(instance.accessOut('container'))
    //                     === typeInfo.basic('array')) {
    //                         return ast2.nativeOut(
    //                             {
    //                                 js: (pass, target) => {
    //                                     pass.write(
    //                                         target('__self.get(\'container\''
    //                                         + '[' + '__self.get(\'index\')' + '])'));
    //                                 }
    //                             }
    //                         )
    //                 }
    //             }
    //         )
    //     )
    // )
};
