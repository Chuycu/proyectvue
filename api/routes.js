const {Router} = require('express');
const Consultas = require('./Consultas');
const send = require('send');
const route = Router();

const consultaHospital = new Consultas('127.0.0.1', 'CarlosNieto', 'Supermen2.1', 'hospital');

route.get('/',(req,res)=>{
    res.status(200).redirect('/home');
})

//insertar un usuario
route.post('/create-user', async (req, res) => {
  const { contrasena, correo,direccion,edad,id_usuario, nombre  } = req.body;
  req.session.nombre = nombre;
  try {
    const propiety = ['id_usuario','nombre','edad','direccion']
    
      if(propiety.every(propiety=> Object.keys(req.body).includes(propiety))){
        
        const result = await consultaHospital.insert('usuarios',` VALUES (${id_usuario},'${nombre}',${edad},'${direccion}','${correo}','${contrasena}')`);
        const registroExitoso = true;
       
      
        if (registroExitoso ) {
          res.status(200).json({ success: true, message: 'Usuario registrado correctamente.' });
        } else {
          res.status(400).json({ success: false, message: 'Error al registrar el usuario.' });
        }
      } 
      
      else{
        
        const result = await consultaHospital.selectUsers('usuarios');
        
        const validationLogin = result.some(usuario=> usuario.correo == correo && usuario.contrasena == contrasena );
        if(validationLogin == true){
          res.status(201).json({ isLogin: true});
        }else{  
          res.status(400).json({ isLogin: false});
        }
      }

    } catch (error) {
      consultaHospital.closeConections();
      res.status(500).json({ success: false, message: 'Error al registrar el usuario.' });
    }
  });

  route.post('/create-cita', async (req, res)=>{
    try{
      const {cedula,fecha, fechaCita,proceso} = req.body;
      const data = req.body
      const result = await consultaHospital.insert('citas',`(id_usuario,fecha,dia_cita,caso) VALUES (${cedula},'${fecha}','${fechaCita}','${proceso}')`);
      // consultaHospital.closeConections();
      res.status(201).json({ message:'Proceso completado'});

    }catch(error){
      res.status(500).json({message:error})
    }
  } );
  
  route.get('/select-usuarios', async (req, res) => {
    try {
      const result = await consultaHospital.select('usuarios', 'citas');

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error });
    }
    consultaHospital.closeConections();
  });

  route.delete('/eliminar-cita/:id', async(req,res)=>{
    const id_cita  = req.params.id;
    const result = await consultaHospital.delete('citas', id_cita);
    consultaHospital.closeConections();
    res.json(result);
  })

  route.patch('/cambiar-usuario-cita/:table/:id_documento',async (req, res) => {
    const data = req.body;
    const table = req.params.table;
    let id_documento = req.params.id_documento;
    let fecha = data.fecha_cita
    let condicion = '';
    if(table =='citas'){
      condicion = 'id_cita';
      let result = await consultaHospital.selectFechaId(id_documento,fecha)
      condicion= `${condicion} = ${result[0].id_cita} `;
      let claves = Object.keys(data);
      let ultiClave = claves[claves.length - 1];
      delete data[ultiClave];
    }else{
      condicion = 'id_documento';
      condicion= `${condicion} = ${id_documento}`
    }
    let updateString = '';
    for (let clave in data) {
      if (data.hasOwnProperty(clave)) {
        let value = data[clave];
        //Ver si es numero
        if(value != ''){
          const isNumeric = !isNaN(value) && value !== '' && value !== null;
          // Construir la parte de la cadena de actualización
          updateString += `${clave} = ${isNumeric ? value : `'${value}'`}, `;
        }
      }
    }
    // Eliminar la coma y el espacio al final de la cadena
    updateString = updateString.slice(0, -2);
    let result = await consultaHospital.update(table,updateString,condicion);
    consultaHospital.closeConections();
    res.status(200).send('');
  });
  
module.exports = route;